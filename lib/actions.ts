import { GraphQLClient } from "graphql-request";
import { 
  createProjectMutation, 
  createUserMutation, 
  deleteProjectMutation, 
  updateProjectMutation, 
  getProjectByIdQuery, 
  getProjectsOfUserQuery, 
  getUserQuery, 
  getProjectsQuery 
} from "@/graphql";
import { ProjectForm, UserProfile } from "@/common.types";

const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';

const client = new GraphQLClient(apiUrl);

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
  } catch (err) {
    console.error("Error fetching token:", err);
    throw err;
  }
};

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });
    return response.json();
  } catch (err) {
    console.error("Error uploading image:", err);
    throw err;
  }
};

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (err) {
    console.error("Error making GraphQL request:", err);
    throw err;
  }
};

export const fetchAllProjects = async (category?: string | null, endcursor?: string | null) => {
  client.setHeader("x-api-key", apiKey);
  try {
    return await makeGraphQLRequest(getProjectsQuery, { category, endcursor });
  } catch (err) {
    console.error("Error fetching projects:", err);
    throw err;
  }
};

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
  try {
    const imageUrl = await uploadImage(form.image);
    if (imageUrl.url) {
      client.setHeader("Authorization", `Bearer ${token}`);

      const variables = {
        input: { 
          ...form, 
          image: imageUrl.url, 
          createdBy: creatorId 
        }
      };

      return await makeGraphQLRequest(createProjectMutation, variables);
    } else {
      throw new Error("Failed to upload image.");
    }
  } catch (err) {
    console.error("Error creating new project:", err);
    throw err;
  }
};

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
  function isBase64DataURL(value: string) {
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }

  let updatedForm = { ...form };
  try {
    const isUploadingNewImage = isBase64DataURL(form.image);
    if (isUploadingNewImage) {
      const imageUrl = await uploadImage(form.image);
      if (imageUrl.url) {
        updatedForm = { ...updatedForm, image: imageUrl.url };
      }
    }

    client.setHeader("Authorization", `Bearer ${token}`);
    const variables = {
      id: projectId,
      input: updatedForm,
    };

    return await makeGraphQLRequest(updateProjectMutation, variables);
  } catch (err) {
    console.error("Error updating project:", err);
    throw err;
  }
};

export const deleteProject = async (id: string, token: string) => {
  client.setHeader("Authorization", `Bearer ${token}`);
  try {
    return await makeGraphQLRequest(deleteProjectMutation, { id });
  } catch (err) {
    console.error("Error deleting project:", err);
    throw err;
  }
};

export const getProjectDetails = async (id: string) => {
  client.setHeader("x-api-key", apiKey);
  try {
    return await makeGraphQLRequest(getProjectByIdQuery, { id });
  } catch (err) {
    console.error("Error fetching project details:", err);
    throw err;
  }
};

export const createUser = async (name: string, email: string, avatarUrl: string): Promise<UserProfile | null> => {
  client.setHeader("x-api-key", apiKey);

  const variables = {
    input: { name, email, avatarUrl },
  };

  try {
    const response = await makeGraphQLRequest(createUserMutation, variables);
    const data = response as { mongoDB: { createUser: UserProfile } };
    console.log('User creation response:', data);
    return data.mongoDB.createUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserProjects = async (id: string, last?: number) => {
  client.setHeader("x-api-key", apiKey);

  if (!id || typeof id !== 'string') {
    throw new Error("Invalid user ID provided");
  }

  if (last && typeof last !== 'number') {
    throw new Error("Invalid 'last' parameter provided");
  }

  try {
    return await makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
  } catch (err) {
    console.error("Error fetching user projects:", err);
    throw err;
  }
};

export const getUser = async (email: string): Promise<{ user?: UserProfile } | null> => {
  client.setHeader("x-api-key", apiKey);
  
  try {
    const response = await makeGraphQLRequest(getUserQuery, { email });
    const data = response as { mongoDB: { user: UserProfile | null } };
    return data.mongoDB.user ? { user: data.mongoDB.user } : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
