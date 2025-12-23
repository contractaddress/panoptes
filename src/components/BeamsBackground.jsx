import Beams from './Beams.jsx';

const BeamsBackground = () => {
  return (
    <div className="beams-background">
      <Beams
        beamWidth={3}
        beamHeight={30}
        beamNumber={20}
        lightColor="#cecece"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={30}
      />
    </div>
  );
};

export default BeamsBackground;
