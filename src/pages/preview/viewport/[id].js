import { useRouter } from 'next/router'
import Error from 'next/error'
import ApiService from 'services/contentful'
import logger from 'services/logger'
import Viewport from 'components/Viewport';
import Head from 'next/head'

const ViewportPreview = (props) => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  const { viewport } = props;
  return props.error ?
    <Error statusCode={props.error.code} />
    : <>
      <Head>
        <title>{`Preview of ${viewport.fields.name} | ${viewport.sys.id}`}</title>
        <meta name="description" content={`Preview of ${viewport.fields.name} | ${viewport.sys.id}`} />
      </Head>
      <Viewport viewport={viewport} />
    </>
}

export async function getStaticProps(context) {
  // get us a client to work with
  const api = new ApiService(
    process.env.CONTENTFUL_CDN_PREVIEW_KEY,
    process.env.CONTENTFUL_SPACE_ID,
    'master',
    true // use preview api
  )
  try {
    // get the viewport
    const viewport = await api.queryEntries({
      'content_type': 'viewport',
      'sys.id': context.params.id,
      include: 10
    })
    // not found
    if (!viewport.total) {
      return { notFound: true }
    }
    // pass data to the component
    return {
      props: {
        params: { ...context.params },
        viewport: viewport.items[0]
      },
      revalidate: 60
    }
  } catch (error) {
    logger.error(error, 'context', context)
    if (error.sys && error.sys.id === 'NotFound') {
      return { notFound: true }
    }
    return {
      props: {
        error: {
          code: 500
        }
      }
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  };
}

export default ViewportPreview
