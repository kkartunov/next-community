import Error from 'next/error'
import Route from 'components/Route'
import ApiService from 'services/contentful'
import logger from 'services/logger'
import { loadRoute } from 'utils/helpers'
import TopcoderFooter from 'components/TopcoderFooter';

const Community = (props) => {
  return props.error ?
    <Error statusCode={props.error.code} />
    : <>
      {Route(props)}
      <TopcoderFooter />
    </>
}

export async function getStaticProps(context) {
  // get us a client to work with
  const api = new ApiService(
    process.env.CONTENTFUL_CDN_API_KEY,
    process.env.CONTENTFUL_SPACE_ID,
  )
  try {
    // get /community route
    const communityRoute = await api.getEntry(process.env.COMMUNITY_ROUTE_ID)
    // try find the child route maped to the path
    // and load it for rendering
    const childRoute = await loadRoute(api, communityRoute, context.params.route)
    // not found
    if (!childRoute) {
      return { notFound: true }
    }
    // pass data to the Route component
    return {
      props: {
        params: { ...context.params },
        route: childRoute
      },
      revalidate: 60
    }
  } catch (error) {
    logger.error(error, 'context', context)
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
    paths: [
      { params: { route: ['learn'] } },
      { params: { route: ['member-programs'] } },
      { params: { route: ['member-programs', 'webinars'] } }
    ],
    fallback: true
  };
}

export default Community
