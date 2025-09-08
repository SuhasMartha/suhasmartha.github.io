import { motion } from "framer-motion";

const Skillset = () => {
  const skillsets = [
    {
      id: "languages",
      softUsed: ["Python","C","Java","R"],
      title: "Languages",
    },
    {
      id: "Web",
      softUsed: ["HTML", "CSS", "JavaScript", "React"],
      title: "Web",
    },
    {
      id: "Machine Learning",
      softUsed: ["TensorFlow", "PyTroch", "Sckilt-Learn", "NLP"],
      title: "Machine Learning",
    },
    {
      id: "Cloud",
      softUsed: ["AWS", "Gloogle Cloud", "Azure"],
      title: "Cloud",
    },
    {
      id: "database",
      softUsed: ["SQL","MongoDB"],
      title: "Database",
    },
    {
      id: "Tools",
      softUsed: ["Git", "VS Code", "PowerBi", "MS Office Suite"],
      title: "Tools",
    },
  ];
  return (
    <div id="skillset">
      <div className="grid grid-cols-3 grid-rows-2 gap-2">
        {skillsets.map((skillset, index) => (
          <motion.div
            key={skillset.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 + index * 0.5, ease: "easeIn" }}
            className="dark:border-2ndry-2 border-primary-2 rounded border-2 p-2 text-center"
          >
            <div className="mb-2 border-b-1 font-bold">{skillset.title}</div>
            <div>{skillset.softUsed.join(", ")}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Skillset;