import { createFileRoute } from '@tanstack/react-router'
import { DefaultLayout } from '@/layouts/default-layout'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <DefaultLayout>
      <h1>about</h1>
    </DefaultLayout>
  )
}
