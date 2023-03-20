import {
  createEffect,
  createSignal,
  createResource,
  Component,
} from "solid-js";
import config from "../config/LAUGH_FACTORY_CONFIG";

import { JSX } from "solid-js/jsx-runtime";

type Joke = {
  value: string;
};

async function fetchJoke(): Promise<Joke> {
  const key = config.LAUGH_FACTORY_KEY 
  const response = await fetch("https://api.api-ninjas.com/v1/jokes?limit=1", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-Api-Key": key,
    },
  });

  const data = await response.json();
  return { value: data[0].joke };
}

type ButtonPos = {
  x: number;
  y: number;
};

export const LaughFactory: Component = () => {
  const [jokeResource, { refetch }] = createResource<Joke>(fetchJoke);

  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(jokeResource.error);
  const [buttonSize, setButtonSize] = createSignal(64);
  const [buttonPos, setButtonPos] = createSignal<ButtonPos>({ x: 100, y: 100 });

  const handleClick = async () => {
    setLoading(true);
    await refetch();
    setLoading(false);
    setButtonSize(Math.floor(Math.random() * 32) + 32);
    setButtonPos({
      x: Math.floor(Math.random() * (window.innerWidth - buttonSize())),
      y: Math.floor(Math.random() * (window.innerHeight - buttonSize())),
    });
  };

  return (
    <div class='flex flex-col items-center justify-center min-h-screen font-serif bg-gradient-to-br from-green-400 via-blue-500 to-purple-600'>
      <button
        onClick={handleClick}
        disabled={loading()}
        class='fixed bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50'
        style={`left: ${buttonPos().x}px; top: ${
          buttonPos().y
        }px; width: ${buttonSize()}px; height: ${buttonSize()}px; font-size: ${
          buttonSize() / 4
        }px;`}
      >
        Get Joke
      </button>
      <div class='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4'>
        {loading() && (
          <p class='text-white text-center' role='status' aria-live='polite'>
            Loading...
          </p>
        )}
        {error() && (
          <p
            class='text-red-100 text-center'
            role='alert'
            aria-live='assertive'
          >
            Oops! Something went wrong. Please try again.
          </p>
        )}
        <p class='text-lg text-white text-center'>
          {jokeResource() && jokeResource().value}
        </p>
      </div>
    </div>
  );
};
