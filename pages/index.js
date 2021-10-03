import Head from 'next/head'
import { gql, GraphQLClient } from 'graphql-request'
import Section from '../components/Section'
import { RichText } from '@graphcms/rich-text-react-renderer';
import React from 'react';

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

const richtextQuery = gql`
query {
 para(where: { slug: "twjkt4i"}) {
  paragr2 {
    raw
  }
}
}
`

const data = await graphQLClient.request(videoQuery) 
const videos = data.videos
const accountData = await graphQLClient.request(accountQuery)
const account = accountData.account
const richtextData = await graphQLClient.request(richtextQuery)
const richtext = richtextData.para

return { 
  props: {
    videos,
    account,
    richtext
}
}
}

export default function Home({ videos, account, richtext }) {
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
      <RichText
        content={richtext.paragr2.raw}
        renderers={{
        p: ({ children }) => <div className="text-green-700 my-3 mx-16 text-md">{children}</div>,
        }}
      />
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
