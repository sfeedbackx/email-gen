import type { Draft } from "../../types/drafts.types";
import { DraftsBanner } from "./DraftsBanner"
import MailBox from "./MailBox";

//const msg ="Cher Professeur Ahmed,\n\nJe vous prie de m'excuser pour l'incomplétude de ma démonstration lors de l'examen d'octobre, et je me permets de vous demander s'il est possible de resubmettre la démonstration afin de pouvoir corriger mes erreurs.\n\nJe remercie avancement votre attention sur ce sujet.\n\nAvec les meilleures salutations,\n\n[Votre nom]";
const drafts: Draft[] = [
  { id: 1, title: "Title 1", message: "Cher Professeur Ahmed,\n\nJe vous prie de m'excuser..." },
  { id: 2, title: "Title 2", message: "Bonjour,\n\nJe voudrais savoir si..." },
  { id: 3, title: "Title 3", message: "Merci pour votre réponse,\n\nJe tenais à vous informer..." },
  {
    id: 4, title: "Title 4", message:
      "Cher Professeur Ahmed,\n\nJe vous prie de m'excuser pour l'incomplétude de ma démonstration lors de l'examen d'octobre, et je me permets de vous demander s'il est possible de resubmettre la démonstration afin de pouvoir corriger mes erreurs.\n\nJe remercie avancement votre attention sur ce sujet.\n\nAvec les meilleures salutations,\n\n[Votre nom"
  },
];
export const DraftSection = (props: {
  draftOpened: boolean
  setDraft: (val: boolean) => void
  selectedDraft: Draft | null
  setSelectedDraft: (d: Draft | null) => void
}) => {
  //const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full p-6 flex flex-col gap-3 overflow-y-auto">
        <div className="text-sm font-bold mb-4">Input label</div>
        {props.selectedDraft ? (
          <MailBox
            message={props.selectedDraft.message}
            onBack={() => { props.setSelectedDraft(null); props.setDraft(false) }}
          />
        ) : (
          drafts.map((draft) => (
            <DraftsBanner
              key={draft.id}
              title={draft.title}
              message={draft.message}
              onClick={() => { props.setSelectedDraft(draft); props.setDraft(true) }}
            />
          ))
        )}

      </div>
    </div>
  )
}
