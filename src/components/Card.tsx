import { Component } from "solid-js";
import { Props } from "astro";

interface Card {
  thumbnail: string;
  alt: string;
  projectTitle: string;
  projectDescription: string;
  route: string;
}

export const Card: Component<Card> = (props) => {
  return (
    <>
      <a
        href={`./${props.route}`}
        class='
        block
        bg-white
        p-4
        rounded-lg
        shadow-lg
      '
      >
        <h2 class='text-lg font-semibold mb-2 text-center'>
          {props.projectTitle}
        </h2>

        <p class='text-gray-600'>{props.projectDescription}</p>

        <div>{props.thumbnail}</div>
        <img src={props.thumbnail} alt={props.alt}></img>
      </a>
    </>
  );
};
