import React from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useFetch } from '../hooks/useFetch'

const Home: React.FC = () => {
  const { data } = useFetch('/api/hello')

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <h1>hello world</h1>

        <span>{data?.name}</span>
      </main>
    </div>
  )
}

export default Home
