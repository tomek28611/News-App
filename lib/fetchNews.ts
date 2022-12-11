import { gql } from 'graphql-request';
import sortNewsByImage from './sortNewsByImage';


const fetchNews = async (
    category?: Category | string,
    keywords?: string,
    isDynamic?: boolean

) => {

    const query = gql`
  query MyQuery(
    $access_key: String!
    $categories: String!
    $keywords: String
  )   {
    myQuery(
        access_key: $access_key
        categories: $categories
        countries: "gb"
        sort: "published_desc"
        keywords: $keywords
    ) {
      data {
        url
        title
        source
        published_at
        language
        image
        description
        country
        category
        author
      }
      pagination {
        total
        offset
        limit
        count
      }
    }
  }
`;
const res = await fetch('https://cochrane.stepzen.net/api/eager-heron/__graphql', {
    method: 'POST',
    cache: isDynamic ? "no-cache" : "default",
    next: isDynamic ? { revalidate: 0 } : { revalidate: 20 },
    headers: {
        "Content-Type": "application/json",
        Authorization: `Apikey ${process.env.STEPZEN_API_KEY}`,
    },
    body: JSON.stringify({
        query,
        variables: {
            access_key: process.env.MEDIASTACK_API_KEY,
            categories: category,
            keywords: keywords,
        },
    }),
});
console.log(
    "Loading new data",
    category,
    keywords
);

const newsResponse = await res.json();

const news = sortNewsByImage(newsResponse.data.myQuery);

return news;

};

export default fetchNews;


// stepzen import curl


// http://api.mediastack.com/v1/news?access_key=1d92681d1281e86608e0f01a2c4425a2&countries=us