export const createProjectMutation = `
  mutation CreateProject($input: ProjectCreateInput!) {
    mongoDB {
      projectCreate(input: $input) {
        project {
          id
          title
          description
          createdById
        }
      }
    }
  }
`;

export const updateProjectMutation = `
  mutation UpdateProject($id: ID!, $input: ProjectUpdateInput!) {
    mongoDB {
      projectUpdate(by: { id: $id }, input: $input) {
        project {
          id
          title
          description
          createdById
        }
      }
    }
  }
`;

export const deleteProjectMutation = `
  mutation DeleteProject($id: ID!) {
    mongoDB {
      projectDelete(by: { id: $id }) {
        deletedId
      }
    }
  }
`;

export const createUserMutation = `
    mutation CreateUser($input: UserCreateInput!) {
      mongoDB {
        userCreate(input: $input) {
          insertedId 
        }
      }
    }
  `;

export const getProjectsQuery = `
  query getProjects($category: String, $endCursor: String) {
    mongoDB {
      projectCollection(first: 8, after: $endCursor, filter: { category: { eq: $category } }) {
        edges {
          node {
            id
            title
            description
            image
            liveSiteUrl
            githubUrl
            category
            createdById
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

export const getProjectByIdQuery = `
  query GetProjectById($id: ID!) {
    mongoDB {
      project(by: { id: $id }) {
        id
        title
        description
        image
        liveSiteUrl
        githubUrl
        category
        createdById
      }
    }
  }
`;

export const getUserQuery = `
  query GetUser($email: String!) {
    mongoDB {
      user(by: { email: $email }) {
        id
        name
        email
        avatarUrl
        description
        githubUrl
        linkedinUrl
      }
    }
  }
`;

export const getProjectsOfUserQuery = `
query getUserProjects($id: ID!) {
  mongoDB {
    user(by: { id: $id }) {
      id
      name
      email
      description
      avatarUrl
      githubUrl
      linkedinUrl
      projectIds
    }
  }
}
`;
