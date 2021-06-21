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
        <meta name="description" content={fields.description}></meta>
      </Head>
      <Viewport viewport={props.route.fields.viewport.items[0]} />
    </>
  )
}

export default Route
