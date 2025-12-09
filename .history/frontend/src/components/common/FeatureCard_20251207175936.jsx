import { motion } from "framer-motion";

export const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="card text-center hover:shadow-lg"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: -5 }}
        className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center"
      >
        <Icon className="h-6 w-6 text-primary-600" />
      </motion.div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
