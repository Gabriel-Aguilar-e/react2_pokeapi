// Buscar Error

import { json,redirect } from "@remix-run/node";
import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  NavLink,
  useNavigate
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";
import appStylesHref from "./app.css?url"; 
import { createEmptyContact } from "./data";


export const action = async () => {
  const pokemon = await createEmptyContact();
  return redirect(`/pokemons/${pokemon.name}/edit`)
}

type Pokemon = {
  name: string;
  url: string;
};

type LoaderData = {
  results: Pokemon[];
  next: string | null;
  previous: string | null;
}



export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const apiUrl = url.searchParams.get('url') || 'https://pokeapi.co/api/v2/pokemon'; 

  const response = await fetch(apiUrl); 

  if (!response.ok){
    throw new Error("Error")
  }
  const pokeApi: LoaderData[] = await response.json()
  const pagAnt = pokeApi.previous
  const pagSig = pokeApi.next
  const pokemons: Pokemones[] = pokeApi.results
  return json({pokemons, pagAnt, pagSig}) 
}
export const links: LinksFunction = () => [
  { rel: "stylesheet", href:appStylesHref }
]



export default function App() {
  const {pokemons, pagAnt, pagSig} = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const pagination = (url: string | null) => {
    if (url) {
      const limitadorDeBusqueda = url.replace(/limit=\d+/, 'limit=20');
      navigate(`/?url=${encodeURIComponent(limitadorDeBusqueda)}`);
    }
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">Añadir</button>
            </Form>
          </div>
          <nav>
            {pokemons.length ? (
              <ul>
                {pokemons.map((pokemon) => (
                  <li key={pokemon.name}>
                    <  NavLink 
                      className={
                        ({ isActive, isPending }) =>
                          isActive ?
                        "active"
                        : isPending ?
                        "pending" :
                        ""
                       }
                      to={`pokemons/${pokemon.name}`}>
                      {pokemon.name ? (
                        <>
                        {pokemon.name}
                        </>
                      ) : (
                        <i>Sin Nombre</i>
                      )}{" "}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No pokemons</i>
              </p>
            )}
          </nav>
          <div>
          { pagAnt && (
              <button onClick={ () => pagination(pagAnt)}>Anterior</button>
            )}
              
            { pagSig && (
              <button onClick={ () => pagination(pagSig)}>Siguiente</button>
            )}
          </div>
        </div>
        <div id="detail">  
          <Outlet/>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}