import { useState, ChangeEvent } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TASK } from "../GraphQL/Mutation";
import { GET_ALL_TAGS, GET_ALL_TASKS } from "../GraphQL/Queries";

function Form() {
  interface Tag {
    _id: string;
    colorCode: string;
    name: string;
  }

  const initialValues = {
    description: "",
    tags: [] as string[],
  };

  const { data } = useQuery(GET_ALL_TAGS); // On récupère les tags dans la DBB

  const [formValues, setFormvalues] = useState(initialValues);
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_ALL_TASKS }],
  });

  const handleDescChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormvalues({ ...formValues, [name]: value });
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (formValues.tags.includes(value)) {
      // Si le tag est déjà sélectionné, le retirez du tableau
      setFormvalues({
        ...formValues,
        tags: formValues.tags.filter((tag) => tag !== value),
      });
    } else {
      // Sinon, ajoutez-le au tableau
      setFormvalues({
        ...formValues,
        tags: [...formValues.tags, value],
      });
    }
  };
  console.log(formValues);

  const handleForm = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Créez une tâche en utilisant les valeurs du formulaire, y compris les groupes sélectionnés
    await createTask({
      variables: {
        description: formValues.description,
        tags: formValues.tags,
      },
    });
    // Réinitialisez le formulaire après la création de la tâche
    //setFormvalues(initialValues);
  };

  return (
    <form
      className="mt-6 max-w-md mx-auto p-4 bg-gray-200 shadow-md rounded-lg"
      onSubmit={handleForm}
    >
      <h2>Ajouter une tâche</h2>
      <br />
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description de la tâche
        </label>
        <input
          className="w-full px-3 py-2 border rounded-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="description"
          id="description"
          placeholder="Entrez une description"
          onChange={handleDescChange}
          value={formValues.description}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Groupes
        </label>
        <div className="space-y-2">
          {data?.getAllTags.map((tag: Tag) => (
            <label key={tag._id} className="flex items-center">
              <input
                type="checkbox"
                name="tags"
                value={tag._id}
                checked={formValues.tags.includes(tag._id)}
                onChange={handleTagChange}
                className="mr-2"
              />
              <span className="text-gray-700">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        Créer une tâche
      </button>
    </form>
  );
}

export default Form;
