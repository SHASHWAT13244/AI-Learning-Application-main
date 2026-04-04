import { BeatLoader } from 'react-spinners';

const Spinner = ({ height = 'screen' }: { height?: string }) => {
    const color = '#10b981';
    return (
        <div className={`flex items-center justify-center min-h-${height}`}>
            <BeatLoader size={20} color={color} />
        </div>
    );
};

export default Spinner;
