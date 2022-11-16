import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { useQuery } from 'react-query'

type StatKey = 'total-mints' | 'total-tokens' | 'total-wallets'
export const statsNames: StatKey[] = [
  'total-mints',
  'total-tokens',
  'total-wallets',
]

export const useGlobalStats = () => {
  const index = new ApolloClient({
    uri: 'https://welcome-elk-85.hasura.app/v1/graphql',
    cache: new InMemoryCache({ resultCaching: false }),
  })

  return useQuery<
    | {
        [n: string]: { data: number }
      }
    | undefined
  >(['useGlobalStats'], async () => {
    const queryResult = await index.query({
      query: gql`
        query GetTokenManagers {
          q1: acc_176_aggregate(where: { kind: { _eq: "4" } }) {
            aggregate {
              count
            }
          }
          q2: acc_176_aggregate(
            where: { kind: { _eq: "4" } }
            distinct_on: recipientTokenAccount
            order_by: { recipientTokenAccount: desc }
          ) {
            aggregate {
              count(distinct: true)
            }
          }
        }
      `,
    })
    const tokenManagers = queryResult.data as {
      q1?: { aggregate?: { count?: number } }
      q2?: { aggregate?: { count?: number } }
    }
    console.log(queryResult, tokenManagers)
    return {
      'total-mints': { data: 5300 },
      'total-tokens': { data: 262463},
      'total-wallets': { data: 163 },
    }
  })
}

export const statsNameMapping: { key: StatKey; displayName: string }[] = [
  {
    key: 'total-mints',
    displayName: 'Dictators Supply',
  },
  {
    key: 'total-wallets',
    displayName: 'Listed Count',
  },
  {
    key: 'total-tokens',
    displayName: 'NUKE In Circulation',
  },
]
