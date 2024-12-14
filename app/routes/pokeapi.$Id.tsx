
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getContact } from "../data";
import type { LoaderFunctionArgs } from "@remix-run/node";


export const loader = async ({params}: LoaderFunctionArgs) => {
    invariant(params.results, "No se ingreso el contactId") 
    const pokemon = await getContact(params.results);
    if( !pokemon) {
        throw new Response("Not found", {status: 404} )
    }
    return json({pokemon})
}

export default function Pokemon() {
  const {pokemon} = useLoaderData <typeof loader>();
 
  return (
    <div id="pokemon">
      <div>
        <img
          alt={`${pokemon.first} ${pokemon.last} avatar`}
          key={pokemon.avatar}
          src={pokemon.avatar}
        />
      </div>
 
      <div>
        <h1>
          {pokemon.first || pokemon.last ? (
            <>
              {pokemon.first} {pokemon.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
        </h1>
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
 
          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
