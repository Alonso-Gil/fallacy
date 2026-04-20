export type AuthBackground = {
  src: string;
  author: string;
  authorUrl: string;
  photoUrl: string;
};

const AUTH_BACKGROUNDS: [AuthBackground, ...AuthBackground[]] = [
  {
    src: "/assets/images/background/agatha-depine-_wf-ubkK9jE-unsplash.jpg",
    author: "Ágatha Depiné",
    authorUrl:
      "https://unsplash.com/es/@agathadepine?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
    photoUrl:
      "https://unsplash.com/es/fotos/gente-sentada-en-el-suelo-pintando-_wf-ubkK9jE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  {
    src: "/assets/images/background/calvin-craig-y8b001e2bs0-unsplash.jpg",
    author: "Calvin Craig",
    authorUrl:
      "https://unsplash.com/es/@_calvincraig?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
    photoUrl:
      "https://unsplash.com/es/fotos/arte-del-techo-de-la-capilla-sixtina-y8b001e2bs0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  {
    src: "/assets/images/background/stephanie-moody-TTwPQPZe9Bs-unsplash.jpg",
    author: "Stephanie Moody",
    authorUrl:
      "https://unsplash.com/es/@stephmoody?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
    photoUrl:
      "https://unsplash.com/es/fotos/una-estatua-de-una-mujer-y-un-hombre-en-un-edificio-TTwPQPZe9Bs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  {
    src: "/assets/images/background/sam-45RHKtUf3y4-unsplash.jpg",
    author: "Sam",
    authorUrl:
      "https://unsplash.com/es/@samtakespictures?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
    photoUrl:
      "https://unsplash.com/es/fotos/una-foto-en-blanco-y-negro-del-busto-de-un-hombre-45RHKtUf3y4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  {
    src: "/assets/images/background/egor-myznik-1zS9dvV1iAM-unsplash.jpg",
    author: "Egor Myznik",
    authorUrl:
      "https://unsplash.com/es/@vonshnauzer?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
    photoUrl:
      "https://unsplash.com/es/fotos/3-hombres-con-camisa-negra-bailando-1zS9dvV1iAM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  {
    src: "/assets/images/background/giammarco-boscaro-zeH-ljawHtg-unsplash.jpg",
    author: "Giammarco Boscaro",
    authorUrl:
      "https://unsplash.com/es/@giamboscaro?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
    photoUrl:
      "https://unsplash.com/es/fotos/lote-de-libros-en-estanteria-de-madera-negra-zeH-ljawHtg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  {
    src: "/assets/images/background/alex-block-PdDBTrkGYLo-unsplash.jpg",
    author: "Alex Block",
    authorUrl:
      "https://unsplash.com/es/@alexblock?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
    photoUrl:
      "https://unsplash.com/es/fotos/una-biblioteca-llena-de-muchos-libros-y-busturines-PdDBTrkGYLo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  },
  {
    src: "/assets/images/background/ariel-tang-jp4ga0o7Cts-unsplash.jpg",
    author: "Ariel Tang",
    authorUrl:
      "https://unsplash.com/es/@crimsonmiraclet?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",
    photoUrl:
      "https://unsplash.com/es/fotos/un-campus-cubierto-de-nieve-con-una-estatua-en-primer-plano-jp4ga0o7Cts?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
  }
];

export const pickRandomAuthBackground = (): AuthBackground => {
  const index = Math.floor(Math.random() * AUTH_BACKGROUNDS.length);
  return AUTH_BACKGROUNDS[index] ?? AUTH_BACKGROUNDS[0];
};
