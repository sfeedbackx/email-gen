import { useState , useEffect} from "react"
export default function MailBox(props: { message: string, onBack: () => void }) {
  const [editable , setEditable] = useState(false)
   const [message, setMessage] = useState(props.message)
  useEffect(() => {
    setMessage(props.message)
    setEditable(false)
  }, [props.message])
  return (
    <>
      <div className="flex flex-col h-8/12 ">

        {editable ?
          <textarea
            value={message}
            onChange={ (e) => setMessage(e.target.value)}
            className="text-sm/7 bg-gray-100 rounded-lg border p-1 w-full  flex flex-1
             font-mono text-gray-800 whitespace-pre-wrap "
          /> :
          <div className="text-sm/7 bg-gray-100  flex rounded-lg border p-2 w-full font-mono text-gray-800 whitespace-pre-wrap flex-1">
            {message}
          </div>
        }
        { /* {"Cher Professeur Ahmed,\n\nJe vous prie de m'excuser pour l'incomplétude de ma démonstration lors de l'examen d'octobre, et je me permets de vous demander s'il est possible de resubmettre la démonstration afin de pouvoir corriger mes erreurs.\n\nJe remercie avancement votre attention sur ce sujet.\n\nAvec les meilleures salutations,\n\n[Votre nom]"}*/}
      </div>
      <div className="mt-auto justify-between  flex w-full">
        <button className="w-12 h-8 border  text-center rounded-lg 
          hover:bg-blue-50 hover:text-blue-500 active:scale-95
          transition-all duration-150 cursor-pointer " onClick={props.onBack}>
          back
        </button>
        <button className="w-12 h-8 border  text-center rounded-lg 
          hover:bg-blue-50 hover:text-blue-500 active:scale-95
          transition-all duration-150 cursor-pointer" onClick={() => setEditable(!editable)}>
          Edit
        </button>
      </div>
    </>
  )
}

