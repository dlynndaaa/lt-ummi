import LandingHeader from "@/app/landing/landing-header"
import LandingHero from "@/app/landing/landing-hero"
import LandingTentang from "@/app/landing/landing-tentang"
import LandingLabs from "./landing/landing-labs"
import LandingInformasi from "@/app/landing/landing-informasi"
import LandingFooter from "@/app/landing/landing-footer"

export default function HomePage() {
  return (
    <>
      <LandingHeader />
      <main className="min-h-screen">
        <LandingHero />
        <LandingTentang />
        <LandingLabs />
        <LandingInformasi />
        <LandingFooter />
      </main>
    </>
  )
}
