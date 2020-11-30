/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPreference = /* GraphQL */ `
  mutation CreatePreference(
    $input: CreatePreferenceInput!
    $condition: ModelPreferenceConditionInput
  ) {
    createPreference(input: $input, condition: $condition) {
      id
      preferences
      allergies
      createdAt
      updatedAt
    }
  }
`;
export const updatePreference = /* GraphQL */ `
  mutation UpdatePreference(
    $input: UpdatePreferenceInput!
    $condition: ModelPreferenceConditionInput
  ) {
    updatePreference(input: $input, condition: $condition) {
      id
      preferences
      allergies
      createdAt
      updatedAt
    }
  }
`;
export const deletePreference = /* GraphQL */ `
  mutation DeletePreference(
    $input: DeletePreferenceInput!
    $condition: ModelPreferenceConditionInput
  ) {
    deletePreference(input: $input, condition: $condition) {
      id
      preferences
      allergies
      createdAt
      updatedAt
    }
  }
`;
