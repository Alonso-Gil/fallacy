import { twMerge } from "tailwind-merge";

import { RandomFallacyProps as Props } from "./RandomFallacytypes";

const RandomFallacy: React.FC<Props> = ({ className }) => {
  return (
    <article className={twMerge(className, "2x1:p-0 p-12 md:max-w-screen-md")}>
      <h2 className="pb-4">- Falacia de falsa analogía</h2>
      <p className="text-typography-soft dark:text-typography-dark-accent">
        Es un error de razonamiento que se comete al establecer una comparación
        entre dos cosas que, en realidad, no son lo suficientemente similares
        como para justificar la conclusión que se extrae. Esta falacia asume que
        porque dos cosas comparten algunas similitudes, también deben ser
        similares en otros aspectos importantes.
      </p>
    </article>
  );
};

export default RandomFallacy;
