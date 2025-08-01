import pool from "@/lib/db/connection";

interface Schedule {
  practicum_assignment_id: number;
  subject_id: number;
  lecturer_id: number;
  day_id: number;
  time_slot_ids: number[];
  lab_id: number;
  study_program_id: number;
  class_id: number;
  semester_id: number;
  credit: number;
}

const DAYS = [1, 2, 3, 4, 5];
const POPULATION_SIZE = 50;
const GENERATIONS = 100;
const MUTATION_RATE = 0.1;

export async function generateScheduleWithGA(
  semesterId: number,
  labId: number,
  usedSlots: { [key: string]: Set<number> }
): Promise<Schedule[]> {
  const assignments = await getAllAssignments(semesterId);
  const timeSlotsMap = await getAllTimeSlots(); // Map with time info
  const timeSlotIds = Array.from(timeSlotsMap.keys());

  if (assignments.length === 0 || timeSlotIds.length === 0) {
    console.warn("[GA] Tidak ada assignment atau time slot ditemukan.");
    return [];
  }

  let population = initializePopulation(assignments, labId, timeSlotIds, timeSlotsMap, usedSlots);

  for (let gen = 0; gen < GENERATIONS; gen++) {
    const fitnessScores = population.map(ind => evaluateFitness(ind));
    const selected = selectParents(population, fitnessScores);
    const children = crossover(selected);
    const mutated = mutate(children, timeSlotIds, labId, timeSlotsMap, usedSlots);
    population = mutated;
  }

  const best = population.sort((a, b) => evaluateFitness(b) - evaluateFitness(a))[0];
  return best;
}

async function getAllAssignments(semesterId: number): Promise<Schedule[]> {
  const result = await pool.query(
    `SELECT pa.id AS practicum_assignment_id,
            pa.subject_id,
            pa.lecturer_id,
            pa.study_program_id,
            pa.class_id,
            pa.semester_id,
            s.credit
     FROM practicum_assignments pa
     JOIN subjects s ON pa.subject_id = s.id
     WHERE pa.semester_id = $1 AND pa.lecturer_id IS NOT NULL`,
    [semesterId]
  );

  return result.rows.map((row) => ({
    practicum_assignment_id: row.practicum_assignment_id,
    subject_id: row.subject_id,
    lecturer_id: row.lecturer_id,
    day_id: 0,
    time_slot_ids: [],
    lab_id: 0,
    study_program_id: row.study_program_id,
    class_id: row.class_id,
    semester_id: row.semester_id,
    credit: row.credit,
  }));
}

async function getAllTimeSlots(): Promise<Map<number, { start: number; end: number }>> {
  const result = await pool.query(`SELECT id, start_time, end_time FROM time_slots ORDER BY id ASC`);
  const map = new Map<number, { start: number; end: number }>();
  result.rows.forEach(row => {
    map.set(row.id, {
      start: timeToMinutes(row.start_time),
      end: timeToMinutes(row.end_time),
    });
  });
  return map;
}

function initializePopulation(
  base: Schedule[],
  lab_id: number,
  timeSlotIds: number[],
  timeSlotsMap: Map<number, { start: number; end: number }>,
  usedSlots: { [key: string]: Set<number> }
): Schedule[][] {
  const population: Schedule[][] = [];

  for (let i = 0; i < POPULATION_SIZE; i++) {
    const individual: Schedule[] = [];
    const usedTimeByDayLab: { [key: string]: { start: number; end: number }[] } = {};

    for (const item of base) {
      let scheduled = false;
      let attempt = 0;

      while (!scheduled && attempt < 100) {
        const day = getRandomItem(DAYS);
        const slots = getSequentialSlots(timeSlotIds, item.credit);
        const key = `${day}-${lab_id}`;

        if (!usedTimeByDayLab[key]) usedTimeByDayLab[key] = [];

        const conflict = isSlotConflict(slots, timeSlotsMap, usedTimeByDayLab[key]);

        if (!conflict) {
          if (!usedSlots[key]) usedSlots[key] = new Set();
          slots.forEach(slot => usedSlots[key].add(slot));
          usedTimeByDayLab[key].push(...slots.map(s => timeSlotsMap.get(s)!));

          individual.push({ ...item, day_id: day, time_slot_ids: slots, lab_id });
          scheduled = true;
        }

        attempt++;
      }

      if (!scheduled) {
        const fallback = getSequentialSlots(timeSlotIds, item.credit);
        individual.push({
          ...item,
          day_id: getRandomItem(DAYS),
          time_slot_ids: fallback,
          lab_id,
        });
      }
    }

    population.push(individual);
  }

  return population;
}

function evaluateFitness(individual: Schedule[]): number {
  let conflicts = 0;

  for (let i = 0; i < individual.length; i++) {
    const a = individual[i];

    for (let j = i + 1; j < individual.length; j++) {
      const b = individual[j];

      const overlap =
        a.day_id === b.day_id &&
        a.time_slot_ids.some(slot => b.time_slot_ids.includes(slot));

      const sameClass = a.class_id === b.class_id;
      const sameLab = a.lab_id === b.lab_id;
      const sameLecturer = a.lecturer_id === b.lecturer_id;

      if (overlap && (sameClass || sameLab || sameLecturer)) {
        conflicts++;
      }
    }
  }

  return 1 / (1 + conflicts);
}

function selectParents(population: Schedule[][], fitnessScores: number[]): Schedule[][] {
  const selected: Schedule[][] = [];
  for (let i = 0; i < population.length; i++) {
    const a = getRandomIndex(population.length);
    const b = getRandomIndex(population.length);
    selected.push(fitnessScores[a] > fitnessScores[b] ? population[a] : population[b]);
  }
  return selected;
}

function crossover(parents: Schedule[][]): Schedule[][] {
  const offspring: Schedule[][] = [];
  for (let i = 0; i < parents.length; i += 2) {
    const p1 = parents[i];
    const p2 = parents[i + 1] || parents[0];
    const point = getRandomIndex(p1.length);
    const c1 = [...p1.slice(0, point), ...p2.slice(point)];
    const c2 = [...p2.slice(0, point), ...p1.slice(point)];
    offspring.push(c1, c2);
  }
  return offspring;
}

function mutate(
  population: Schedule[][],
  timeSlotIds: number[],
  lab_id: number,
  timeSlotsMap: Map<number, { start: number; end: number }>,
  usedSlots: { [key: string]: Set<number> }
): Schedule[][] {
  return population.map(individual => {
    const usedTimeByDayLab: { [key: string]: { start: number; end: number }[] } = {};

    return individual.map(schedule => {
      if (Math.random() < MUTATION_RATE) {
        let success = false;
        let attempt = 0;
        let newDay = schedule.day_id;
        let newSlots: number[] = [];

        while (!success && attempt < 100) {
          newDay = getRandomItem(DAYS);
          newSlots = getSequentialSlots(timeSlotIds, schedule.credit);
          const key = `${newDay}-${lab_id}`;

          if (!usedTimeByDayLab[key]) usedTimeByDayLab[key] = [];

          const conflict = isSlotConflict(newSlots, timeSlotsMap, usedTimeByDayLab[key]);

          if (!conflict) {
            if (!usedSlots[key]) usedSlots[key] = new Set();
            newSlots.forEach(slot => usedSlots[key].add(slot));
            usedTimeByDayLab[key].push(...newSlots.map(s => timeSlotsMap.get(s)!));
            success = true;
          }

          attempt++;
        }

        if (success) {
          return { ...schedule, day_id: newDay, time_slot_ids: newSlots };
        }
      }

      return schedule;
    });
  });
}

function getSequentialSlots(timeSlots: number[], credit: number): number[] {
  const sorted = [...timeSlots];
  const maxStart = sorted.length - credit;
  if (maxStart < 0) return [];
  const startIdx = getRandomIndex(maxStart + 1);
  return sorted.slice(startIdx, startIdx + credit);
}

function isSlotConflict(
  candidateSlots: number[],
  slotMap: Map<number, { start: number; end: number }>,
  existing: { start: number; end: number }[]
): boolean {
  for (const slotId of candidateSlots) {
    const time = slotMap.get(slotId)!;
    for (const e of existing) {
      if (time.start < e.end && time.end > e.start) {
        return true;
      }
    }
  }
  return false;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}
