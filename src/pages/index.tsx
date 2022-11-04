import { FormEvent, useState } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";

import appNlwCopaPreview from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarImg from "../assets/users-avatar-example.png";
import iconCheck from "../assets/icon-check.svg";

import { api } from "../services/api";

interface HomeProps {
  pollCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({
  pollCount = 0,
  guessCount = 0,
  userCount = 0,
}: HomeProps) {
  const [pollTitle, setPollTitle] = useState<string>("");

  async function createPoll(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/polls", {
        title: pollTitle,
      });

      const { code } = response.data;
      await navigator.clipboard.writeText(code);
      setPollTitle("");

      // Notify Code Clipboard
    } catch (error) {
      // Notify Error
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa Logo" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Cria seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarImg} alt="Usuários do Bolão da Copa" />

          <strong className="text-gray-100 text-xl">
            <span className="text-green-500">+{userCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form onSubmit={createPoll} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            onChange={(event) => setPollTitle(event.target.value)}
            value={pollTitle}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-white transition"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="NLW Copa Logo" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{pollCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"></div>

          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="NLW Copa Logo" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appNlwCopaPreview}
        alt="Dois celulares mostrando o aplicativo do Bolão da Copa do Mundo"
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [pollCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/polls/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 600,
  };
};
