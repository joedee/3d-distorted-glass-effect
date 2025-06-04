import styles from './page.module.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Scene = dynamic(() => import('@/components/Scene/Index'), {
    ssr: false,
})

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image 
            src="/medias/logo.png" 
            alt="Logo" 
            width={100} 
            height={40} 
            className={styles.logoImage}
            priority
          />
        </div>
        <nav className={styles.nav}>
          <span>Work</span>
          <span>About</span>
          <span>Contact</span>
        </nav>
        <div className={styles.icon}>✱</div> {/* Simple asterisk for now, can be replaced with an SVG or image */}
      </header>

      <main className={styles.mainContent}>
        <div className={styles.headingContainer}>
        </div>
        <div className={styles.sceneWrapper}>
          <Scene />
        </div>
      </main>
    </div>
  )
}
