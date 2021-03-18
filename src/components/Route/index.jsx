import { useRouter } from 'next/router'
import Head from 'next/head'
import logger from 'services/logger'
import Viewport from 'components/Viewport';

const Route = (props) => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const { fields } = props.route
  logger.log('Route props', props, router.query)

  return (
    <>
      <Head>
        <title>{fields.pageTitle}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={fields.description}></meta>
        <link rel="icon" href="/cropped-TC-Icon-32x32.png" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <Viewport viewport={props.route.fields.viewport.items[0]} />
    </>
  )
}

export default Route
