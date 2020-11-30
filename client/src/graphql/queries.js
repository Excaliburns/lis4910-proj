/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPreference = /* GraphQL */ `
  query GetPreference($id: ID!) {
    getPreference(id: $id) {
      id
      preferences
      allergies
      createdAt
      updatedAt
    }
  }
`;
export const listPreferences = /* GraphQL */ `
  query ListPreferences(
    $filter: ModelPreferenceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPreferences(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        preferences
        allergies
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
