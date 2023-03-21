import { createSignal, createEffect, Accessor, onCleanup } from "solid-js";
import { FaRegularMoon } from "solid-icons/fa";
import { FiSun } from "solid-icons/fi";

interface Phonetics {
  text: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface Word {
  word: string;
  phonetic: string;
  phonetics: Phonetics[];
  origin: string;
  meanings: Meaning[];
}

const fetchWord = async (queryWord: string) => {
  const response = await fetch(
    "https://api.dictionaryapi.dev/api/v2/entries/en/" + queryWord
  );
  const word: Word[] = await response.json();
  return word;
};

const WordExplorer = () => {
  const [queryWord, setQueryWord] = createSignal("");
  const [darkMode, setDarkMode] = createSignal();
  const [error, setError] = createSignal("");

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    try {
      const results = await fetchWord(queryWord());
      setWordData(results);
      setError("");
    } catch (err) {
      setError("Sorry, we couldn't find the word you were looking for.");
    }
  };

  const handleChange = (event: Event) => {
    setQueryWord((event.target as HTMLInputElement).value);
  };

  const [wordData, setWordData] = createSignal<Word[]>([]);

  createEffect(async () => {
    const randomWord = await fetchWord("random");
    setWordData(randomWord);
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode());
  };

  return (
    <>
      <div
        class={`grid items-center h-screen border-3 mh-auto ${
          darkMode()
            ? "border-slate-800 bg-slate-900"
            : "border-gray-300 bg-white"
        }`}
      >
        <button
          class={`absolute top-4 right-4 p-2 rounded-2xl text-slate-800 border-4 border-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2  hover:text-slate-200 hover:bg-slate-800 h-14 w-14 text-3xl text-center mx-auto ${
            darkMode()
              ? "text-black focus:ring-white"
              : "text-white focus:ring-indigo-500"
          }`}
          onClick={toggleDarkMode}
        >
          {darkMode() ? <FiSun style={{color:'white'}}/> : <FaRegularMoon style={{color:'black'}} />}
        </button>

        <h1
          class="text-4xl font-semibold text-center mt-14 mb-8 "
        >
          Word Explorer
        </h1>
        <form
          onSubmit={handleSubmit}
          class='flex flex-col items-center space-y-4'
        >
          <label for='queryBox' class='sr-only'>
            Search for a word
          </label>
          <input
            type='text'
            id='queryBox'
            value={queryWord()}
            onInput={handleChange}
            placeholder='What word are you looking for?'
            class='px-10 py-6 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-[calc(60vw-5rem)] border-blue-800 text-center'
          />
          <button
            type='submit'
            class='px-4 py-2 my-10 text-lg font-semibold text-white bg-indigo-500 rounded-md focus:outline-none focus:ring 2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Search!
          </button>
        </form>
        {error() && <p class='text-lg text-red-500 text-center py-8'>{error}</p>}
        <section>
          {wordData().map((word) => (
            <div class='flex flex-col items-center space-y-4 mx-14 px-8'>
              <h2 class='text-2xl font-semibold underline underline-offset-2 my-4'>{word.word}</h2>
              <p class='text-lg'>{word.phonetic}</p>
              <ul class='list-disc list-inside list-none'>
                {word.meanings.map((meaning) => (
                  <li>
                    <p class='font-medium'>{meaning.partOfSpeech}</p>
                    <ul>
                      {meaning.definitions.map((definition, index) => (
                        <li>
                          <p>{definition.definition}</p>
                          <p class='italic'>Example: {index +1} {definition.example}</p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default WordExplorer;
