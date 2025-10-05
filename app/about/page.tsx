import { IndexLayout } from "@/components/Layout/Index";

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-secondary flex w-full flex-col rounded-t-lg p-2.5 text-center shadow">
    <h2 className="text-2xl font-bold text-red-800">{title}</h2>
  </div>
);

const AboutPage = () => {
  return (
    <IndexLayout>
      {/* Section 1 */}
      <section className="flex flex-col">
        <SectionHeader title="High Premium Product of Holistic Olive Oil and Honey, Healthy Products" />
        <div className="flex w-full flex-col items-center gap-5 rounded-b-lg bg-white p-5 sm:flex-row">
          <span className="text-xl">
            FAOS Thailand began with a simple but powerful idea:{" "}
            <span className="font-bold text-red-800">
              Prioritizing mental health and consuming high-quality,
            </span>{" "}
            natural foods can lead to stronger physical and mental well-being.
            This insight emerged through a surprising discovery from food
            biologists and a deep study of traditional Greek cuisine, one of the
            most respected food cultures in Europe for its health benefits.
            Through community cooking experiments and cooperative learning, we
            found that{" "}
            <span className="font-bold text-red-800">
              Thai and Greek food traditions share many values.
            </span>{" "}
            Both emphasize fresh ingredients, natural preparation, and a strong
            connection to the land. These shared principles inspired us to
            create a line of organic foods and cosmetic products made entirely
            from nature. Every product we develop uses 100% natural ingredients
            that preserve the purity of what we consume and apply to our bodies.
            We believe that{" "}
            <span className="font-bold text-red-800">
              the quality of what we eat and use every day
            </span>{" "}
            has a direct impact on our health. When we consume products that
            contain toxins, our bodies absorb those harmful substances, which
            can lead to frequent illness.{" "}
            <span className="font-bold text-red-800">
              Between 2018 and 2022, Thailand saw a steady rise in mortality
              rates, reaching nine deaths per one thousand people in 2022.
            </span>{" "}
            Male mortality has remained higher than female mortality every year.{" "}
            <span className="font-bold text-red-800">
              In 2022, the male rate was 10.3 while the female rate was 7.7 per
              one thousand people.
            </span>{" "}
            At FAOS Thailand, we recognize that food and everyday products play
            an important role in helping people live longer, healthier, and
            happier lives. Our mission is to provide pure, natural alternatives
            that support well-being both physically and mentally.{" "}
            <span className="font-bold text-red-800">
              We are committed to sharing these products with the people of
              Thailand, throughout Asia, and across the world.
            </span>
          </span>
        </div>
      </section>

      {/* Section 2 */}
      <section className="flex flex-col">
        <SectionHeader title="Founder of FAOS Premium Organic Collection" />
        <div className="flex w-full flex-col items-center gap-5 rounded-b-lg bg-white p-5">
          <span className="text-xl">
            Patcharin Chanaphukdee, the founder of Pure Organic Products — a
            visionary based in Bangkok, Thailand, the land historically known as{" "}
            <span className="font-bold text-red-800">
              Suvaṇṇabhūmi or the "Land of Gold."
            </span>{" "}
            With 19 years of experience in environmental compliance, I’m
            dedicated to sustainability and compliance management. Throughout my
            career, I have built a large social community and a deep connection
            with various sectors. The inception of FAOS Premium Organic
            Collection Olive Oil emerged from my personal journey{" "}
            <span className="font-bold text-red-800">
              towards well-being and sustainability.
            </span>{" "}
            While navigating a period of mental and physical distress caused by{" "}
            <span className="font-bold text-red-800">
              the negative influences of alcoholism in my life,
            </span>{" "}
            I was inspired to seek healing. Despite not being a consumer of
            alcohol, I was deeply affected by its destructive consequences on
            the people around me, leading to emotional unrest and physical
            issues. In search of peace and healing, I found solace in natural
            food and lifestyle during travels around the Mediterranean Sea in
            Europe. This connection with nature deeply resonated with me.
            Through health and wellness guidance and my own exploration of
            nature, I discovered peace in beekeeping, honey, and olive
            cultivation. This newfound appreciation for nature played a
            significant role in calming my mind and emotions. My interest in
            natural healing led me to explore the ancient art of winemaking. I
            experimented with creating natural alcohol from{" "}
            <span className="font-bold text-red-800">
              grapes, honey, blossom flowers, and herbs,
            </span>{" "}
            inspired by{" "}
            <span className="font-bold text-red-800">
              traditional Mediterranean methods integrated with Asian
              traditions.
            </span>{" "}
            Through careful research and scientific experimentation, I ensured
            the process was safe, and this transformative experience motivated
            me to share the benefits of natural, sustainable practices with
            others.{" "}
            <span className="font-bold text-red-800">
              FAOS Premium Organic Collection
            </span>{" "}
            was established to promote{" "}
            <span className="font-bold text-red-800">green sustainability</span>{" "}
            and offer products that nourish both the body and mind. Through the
            company’s efforts, I hope to contribute to the well-being of
            individuals while advocating for a return to nature’s healing
            properties.
          </span>

          <div className="flex flex-col justify-center gap-5 sm:flex-row">
            <img
              src="https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/Profiles/pom1.png"
              className="sm:max-w-96"
            />
            <img
              src="https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/Profiles/pom2.png"
              className="sm:max-w-96"
            />
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="flex flex-col">
        <SectionHeader title="The Essence of Pure Organics Products" />
        <div className="flex w-full flex-col items-center gap-5 rounded-b-lg bg-white p-5">
          <span className="text-xl">
            At <span className="font-bold text-red-800">Pure,</span> we take
            pride in crafting the finest wines and honey, sourced directly from{" "}
            <span className="font-bold text-red-800">
              community organic farms.
            </span>{" "}
            Our mission is to create high premium, natural products that promote{" "}
            <span className="font-bold text-red-800">
              health, sustainability, and well-being.
            </span>
          </span>
        </div>
      </section>

      {/* Section 4 */}
      <section className="flex flex-col">
        <SectionHeader title="Our Commitment to Quality & Sustainability" />
        <div className="flex w-full flex-col items-center gap-5 rounded-b-lg bg-white p-5">
          <span className="text-xl">
            FAOS was founded with a vision: to produce{" "}
            <span className="font-bold text-red-800">
              High Premium Organic Collections
            </span>{" "}
            that contribute to a{" "}
            <span className="font-bold text-red-800">
              greener world and sustainable living.
            </span>{" "}
            We collaborate with organic farming communities across{" "}
            <span className="font-bold text-red-800">Asia and the West,</span>{" "}
            exchanging knowledge and expertise to create{" "}
            <span className="font-bold text-red-800">
              limited-edition natural products.
            </span>
          </span>
        </div>
      </section>

      {/* Section 5 */}
      <section className="flex flex-col">
        <SectionHeader title="The Health Benefits of Organic Olive Oil" />
        <div className="flex w-full flex-col items-center gap-5 rounded-b-lg bg-white p-5">
          <span className="text-xl">
            Our honey and olive oil are made using{" "}
            <span className="font-bold text-red-800">
              scientifically researched methods,
            </span>{" "}
            ensuring each bottle delivers both{" "}
            <span className="font-bold text-red-800">
              quality and health benefits.
            </span>{" "}
            Organic honey and olive oil, when enjoyed in moderation, can:
            <br />
            <b>• Reduce stress & anxiety</b>
            <br />
            <b>• Enhance social connections</b>
            <br />
            <b>• Support heart health</b>
            <br />
            <b>• Promote overall well-being</b>
          </span>
        </div>
      </section>

      {/* Section 6 */}
      <section className="flex flex-col">
        <SectionHeader title="From Farm to Bottle: A Commitment to Excellence" />
        <div className="flex w-full flex-col items-center gap-5 rounded-b-lg bg-white p-5">
          <span className="text-xl">
            Every step of our honey and olive oil process—{" "}
            <span className="font-bold text-red-800">
              from selecting the best organic forests to bottling
            </span>{" "}
            —is carefully monitored. We work closely with{" "}
            <span className="font-bold text-red-800">
              certified organic farms,
            </span>{" "}
            ensuring that no harmful chemicals are used. Each batch undergoes{" "}
            <span className="font-bold text-red-800">rigorous lab testing</span>{" "}
            to guarantee purity, taste, and exceptional quality. At FAOS Premium
            Organic Collection, we believe that{" "}
            <span className="font-bold text-red-800">
              organic products are more than just food—they’re a way to
              celebrate life, good health, and meaningful connections.
            </span>{" "}
            Join us on our journey towards a healthier, sustainable future—one
            sip at a time.
          </span>
        </div>
      </section>
    </IndexLayout>
  );
};

export default AboutPage;
