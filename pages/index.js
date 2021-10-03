import Head from 'next/head'
import { gql, GraphQLClient } from 'graphql-request'
import Section from '../components/Section'

export const getStaticProps = async () => {
  const url = process.env.ENDPOINT_URL
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      authorization: process.env.GRAPH_CMS_TOKEN
  }
})

const videoQuery = gql`
query {
  videos {
    createdAt
    id
    title
    description
    seen
    slug
    tags
    thumbnail {
      url
    }
    mp4 {
      url
    }
  }
}`

const accountQuery = gql`
query {
account(where: { id: "cktmn8jbs693z0a81u2vhb5kl"}) {
  username
}
}
`

const data = await graphQLClient.request(videoQuery) 
const videos = data.videos
const accountData = await graphQLClient.request(accountQuery)
const account = accountData.account

return { 
  props: {
    videos,
    account
}
}
}

export default function Home({ videos, account }) {
  const randomVideo = (videos) => {
    return videos = videos[Math.floor(Math.random() * videos.length)]

  } 

  const filterVideos = (videos, genre) => {
    return videos.filter((video) => video.tags.includes(genre))
}

const unSeenVideos = (videos) => {
  return videos.filter(video => video.seen == false || video.seen == null)
}

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Disney clone test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div><p>Welcome <span>{account.username}</span></p></div>
        <div>
          <img src={randomVideo(videos).thumbnail.url} alt={randomVideo(videos).thumbnail.title} />
        </div>
        <Section genre={'Recommended for you'} videos={unSeenVideos(videos)}/>
        <Section genre={"Fun"} videos={filterVideos(videos, 'fun')} />
        <Section genre={"Education"} videos={filterVideos(videos, 'education')} />
        
      </div>
      
    </>
  )
}
