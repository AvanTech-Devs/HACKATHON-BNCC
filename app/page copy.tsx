import Header from "@/app/components/header";
import ChatSection from "./components/chat-section";
import LessonPlanGenerator from "./components/ui/lesson-plan-generator";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-screen flex justify-center background-gradient">
      <div className="space-y-4 lg:space-y-10 w-[90%] lg:w-[60rem] py-6 overflow-y-auto">
        
        {/* Cabeçalho */}
        <Header />

        {/* Seção de Chat */}
        <div className="h-[65vh] flex border rounded-lg bg-white/80">
          <ChatSection />
        </div>

        {/* Gerador de Plano de Aula */}
        <div className="border rounded-lg bg-white/90 p-4">
          <LessonPlanGenerator />
        </div>

        {/* Botão para ir para a tela de login */}
        <div className="flex justify-center mt-6">
          <Link href="/">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Ir para a tela de login
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}
