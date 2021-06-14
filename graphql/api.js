import useFetch from '../lib/useFetch'

function getData(data) {
  if (!data || data.errors) return null
  return data.data
}

function getErrorMessage(error, data) {
  if (error) return error.message
  if (data && data.errors) {
    return data.errors[0].message
  }
  return null
}

/**
|--------------------------------------------------
| This GraphQL query returns an array of Guestbook
| entries complete with both the provided and implicit
| data attributes.
|
| Learn more about GraphQL: https://graphql.org/learn/
|--------------------------------------------------
*/
export const useAllAuntDates = () => {
  const query = `query AllAuntDates{
    allAuntDates{
      data{
        name
        date
      }
    }
  }`
  const size = 100
  const { data, error } = useFetch(
    process.env.NEXT_PUBLIC_FAUNADB_GRAPHQL_ENDPOINT,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUNADB_SECRET}`,
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { size },
      }),
    }
  )

  return {
    data: getData(data),
    errorMessage: getErrorMessage(error, data),
    error,
  }
}

/**
|--------------------------------------------------
| This GraphQL mutation creates a new GuestbookEntry
| with the requisite twitter handle and story arguments.
|
| It returns the stored data and includes the unique
| identifier (_id) as well as _ts (time created).
|
| The guestbook uses the _id value as the unique key
| and the _ts value to sort and display the date of
| publication.
|
| Learn more about GraphQL mutations: https://graphql.org/learn/queries/#mutations
|--------------------------------------------------
*/
export const createGuestbookEntry = async (twitterHandle, story) => {
  const query = `mutation CreateAuntDate($name: String!, $date: Date!) {
    createAuntDate(data: { name: $name, date: $date }) {
      name
      date
    }
  }
  `

  const res = await fetch(process.env.NEXT_PUBLIC_FAUNADB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUNADB_SECRET}`,
      'Content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { twitterHandle, story },
    }),
  })
  const data = await res.json()

  return data
}
