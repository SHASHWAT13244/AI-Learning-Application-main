import { useEffect, useState } from 'react';
import type { GetAllFlashCardpayloadTypes } from '../../types';
import FlashCardServices from '../../services/FlashCardServices';
import Spinner from '../../components/common/Spinner';
import { EmptyCard } from '../../components/common/EmptyCard';
import { FlashlistCard } from '../../components/flashcards/FlashlistCard';
import { Pageheader } from '../../components/common/Pageheader';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackComponent } from '../../components/common/ErrorFallbackComponent';

const FlashCardListPage = () => {
    const [flashCardSet, setFlashCardSet] = useState<
        GetAllFlashCardpayloadTypes[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);

    //data fetch
    useEffect(() => {
        const fetchFlashCardSets = async () => {
            try {
                const { data } = await FlashCardServices.getAllFlashCardSets();
                setFlashCardSet(data);
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    console.error(error?.message);
                } else {
                    console.error('Failed to fetch flashcard');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchFlashCardSets();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <Spinner />;
        }
        if (flashCardSet.length === 0) {
            return (
                <EmptyCard
                    title="No Flashcard Set Found"
                    description="You haven`t generated any flashacards yet.Go to a document to create you first set"
                />
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <ErrorBoundary
                    fallbackRender={props => (
                        <ErrorFallbackComponent {...props} />
                    )}
                >
                    {flashCardSet?.map(set => (
                        <FlashlistCard key={set._id} card={set} />
                    ))}
                </ErrorBoundary>
            </div>
        );
    };
    return (
        <div>
            <Pageheader title="All FlashCard Sets" />
            {renderContent()}
        </div>
    );
};

export default FlashCardListPage;
