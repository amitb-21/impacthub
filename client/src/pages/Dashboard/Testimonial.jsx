import React from 'react';
import './Testimonial.css'; // Make sure to import your CSS file

const Testimony = () => {
  const testimonials = [
    {
      id: 'pf1',
      initial: 'R',
      text: 'I found the perfect NGO to volunteer with in just a few clicks. Such a smooth experience!',
      name: 'Ritika, Volunteer',
      type: 2
    },
    {
      id: 'pf2',
      initial: 'A',
      text: 'This platform made it so easy to give back to the community. Highly recommended for anyone wanting to volunteer.',
      name: 'Arjun, Volunteer',
      type: 1
    },
    {
      id: 'pf3',
      initial: 'S',
      text: 'I always wanted to work with children, and through this site I finally got connected to an amazing NGO.',
      name: 'Sanya, Volunteer',
      type: 2
    },
    {
      id: 'pf4',
      initial: 'K',
      text: 'Seamless, supportive, and impactful. I feel proud to be part of this network.',
      name: 'Kabir, Volunteer',
      type: 1
    },
    {
      id: 'pf5',
      initial: 'M',
      text: 'A simple and effective way to start volunteering. The guidance I got was super helpful.',
      name: 'Megha, Volunteer',
      type: 2
    },
    {
      id: 'pf6',
      initial: 'H',
      text: 'Thanks to this platform, we\'ve connected with passionate volunteers who really support our cause.',
      name: 'Helping Hands NGO',
      type: 1
    },
    {
      id: 'pf7',
      initial: 'C',
      text: 'The process was easy and efficient. We found reliable volunteers within days.',
      name: 'Care4All Foundation',
      type: 2
    },
    {
      id: 'pf8',
      initial: 'G',
      text: 'This service bridges the gap between NGOs and people who genuinely want to help. Truly valuable.',
      name: 'Green Earth NGO',
      type: 1
    },
    {
      id: 'pf9',
      initial: 'R',
      text: 'We are grateful for the quality of volunteers we\'ve been matched with. It has made a huge difference in our work.',
      name: 'Hope & Light Trust',
      type: 2
    },
    {
      id: 'pf10',
      initial: 'B',
      text: 'A great initiative that strengthens community service. We\'ve had excellent experiences so far.',
      name: 'Bright Futures NGO',
      type: 1
    }
  ];

  return (
    <div className="volunteer">
      <div className="box1">
        <h1>What do people say about us?</h1>
      </div>
      
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="box">
          <div className={testimonial.type === 1 ? "boxinsides1" : "boxinsides2"}>
            <div className="profile" id={testimonial.id}>
              {testimonial.initial}
            </div>
            <div className="data">
              <p>{testimonial.text}</p>
            </div>
          </div>
          <div className={testimonial.type === 1 ? "person1" : "person2"}>
            <p>{testimonial.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Testimony;