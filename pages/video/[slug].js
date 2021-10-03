import { gql, GraphQLClient } from 'graphql-request'
import { useState } from 'react';
import Link from 'next/link'

export const getServerSideProps = async (pageContext) => {
  const url = process.env.ENDPOINT_URL
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      authorization: process.env.GRAPH_CMS_TOKEN
  }
})
  const pageSlug = pageContext.query.slug
  const query = gql`
  query($pageSlug: String!) {
    video(where: {slug: $pageSlug}) {
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
  const variables = {
    pageSlug
  }

  const data = await graphQLClient.request(query, variables)
  const video = data.video

  return {
    props: {
      video
    }
}
}

const changeToSeen = async (slug) => {
  await fetch('/api/changeToSeen', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ slug })
  })
}



const Slug = ({video}) => {
  const [watching, setWatching] = useState(false);
  return (
    <>
      {!watching && <img src={video.thumbnail.url} alt={video.title}/>}
            {!watching && <div className="info">
                <p>{video.tags.join(', ')}</p>
                <p>{video.description}</p>
                <Link href="/"><p>go back</p></Link>
                <button
                    
                    onClick={() => {
                        changeToSeen(video.slug)
                        watching ? setWatching(false): setWatching(true)
                    }}
                >PLAY</button>
            </div>}
            {watching && (
                <video width="100%" controls>
                    <source src={video.mp4.url} type="video/mp4"/>
                </video>
            )}
            <div className="h-32 bg-black"
                 onClick={() => watching ? setWatching(false) : null}
            ></div>
    </>
  )
}

export default Slug
