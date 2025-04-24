import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const BusinessDetails = () => {
  const { t } = useTranslation();

  const details = [
    {
      title: t("businessDetails.ceoFounder.title"),
      value: t("businessDetails.ceoFounder.value"),
      icon: "👤",
    },
    {
      title: t("businessDetails.establishment.title"),
      value: t("businessDetails.establishment.value"),
      icon: "📅",
    },
    {
      title: t("businessDetails.businessNature.title"),
      value: t("businessDetails.businessNature.value"),
      icon: "🌐",
    },
  ];

  return (
    <div className="container mx-auto px-6 -mt--5 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {details.map((detail, index) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative rounded-xl p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="relative p-4 text-center">
                  <span className="text-3xl mb-3 block">{detail.icon}</span>
                  <h2 className="text-spice-text text-sm uppercase tracking-wider mb-2">
                    {detail.title}
                  </h2>
                  <p className="text-xl font-bold text-spice-primary">
                    {detail.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
