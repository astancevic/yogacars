import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import CustomerSaysCard from './CustomerSaysCard';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel';

const customerImageQuery = graphql`
  query CustomerImage {
    file(relativePath: { eq: "customer-image-full.png" }) {
      childImageSharp {
        gatsbyImageData(
          formats: WEBP
          placeholder: BLURRED
          quality: 100
          backgroundColor: "gray"
          width: 80
          outputPixelDensities: 1
        )
      }
    }
  }
`;
function CustomerSaysCards() {
  const {
    file: {
      childImageSharp: { gatsbyImageData }
    }
  } = useStaticQuery(customerImageQuery);

  const popularCardsArrayData = [
    {
      name: 'Jody Gonzales',
      description: `My experience at the Quirk Chevrolet Service center WELL exceeded my expectations. I went for an oil change and tire rotation, they got me right in without an appointment, and the wait time was very limited.`,
      companyName: 'Lobortis risus'
    },
    {
      name: 'Jody Gonzales',
      description: `Just bought a new Jetta SEL from this dealer, I'm really happy and confident with this purchase, I received great customer service from salesman Vinny, he was really helpful in helping me choose the right car. Recommend this dealer.`,
      companyName: 'Lobortis risus'
    },
    {
      name: 'Jody Gonzales',
      description: `We recently purchased a Subaru Forester at Quirk Subaru in Braintree. The experience was fantastic. The sales representative, Michaela Smith was very knowledgeable and professional. The entire process was smooth and seamless`,
      companyName: 'Lobortis risus'
    },

    {
      name: 'Jody Gonzales1',
      description: `Today while waiting for an oil change I was having a discussion with an exceptional young man who’s excitement about the newest model of KIA was contagious. With no intention of trading my KIA in, I am now driving the nicest gas vehicle`,
      companyName: 'Lobortis risus'
    },
    {
      name: 'Jody Gonzales1',
      description: `Professional and smooth transaction. Impressive selection, had the exact vehicles we were looking for. Two Jeeps were pulled inside out of the cold to view and compare and pricing was more than fair. Thank you Eric!`,
      companyName: 'Lobortis risus'
    },
    {
      name: 'Jody Gonzales1',
      description: `HOLY CUSTOMER SUPPORT. I am blown away by this Nissans staff and willingness to help during the process of purchasing a new vehicle. They helped me prior to coming to the dealership over the phone and walked me through in person.`,
      companyName: 'Lobortis risus'
    },

    {
      name: 'Jody Gonzales2',
      description: `The whole process was easy and stress free due the hard work of my salesman making every part of it go seamlessly. Complete explanation of options included in my new GMC then quickly cleaned up for me to drive home was a nice touch.`,
      companyName: 'Lobortis risus'
    }
  ];
  return (
    <div className="mt-5 px-6 @container md:px-10 lg:mt-10">
      <Carousel
        opts={{
          align: 'start'
        }}
      >
        <CarouselContent className="py-5">
          {popularCardsArrayData.map((item, index) => {
            return (
              <CarouselItem
                key={index}
                className="mx-auto flex items-center justify-center md:basis-1/2 lg:basis-1/3 2xl:basis-1/4 4xl:basis-1/5"
              >
                <CustomerSaysCard
                  description={item.description}
                  name={item.name}
                  companyName={item.companyName}
                  image={gatsbyImageData}
                ></CustomerSaysCard>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="mt-5 flex items-center justify-center gap-5">
          <CarouselPrevious className="relative border-primary bg-primary hover:border-primary/50 hover:bg-primary/50" />
          <CarouselNext className=" relative border-primary bg-primary hover:border-primary/50 hover:bg-primary/50" />
        </div>
      </Carousel>
    </div>
  );
}

export default CustomerSaysCards;
