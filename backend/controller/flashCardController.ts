import { NextFunction, Request, Response } from 'express';
import FlashCard from '../model/flashCard';

//@desc   Get all flash cards sets for a user
//@route  GET /api/flashcard/
//@access private
export const getAllFlashCardSets = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const getFlashCardByuser = await FlashCard.find({
      userId: req.user._id,
    })
      .populate('documentId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: getFlashCardByuser.length,
      data: getFlashCardByuser,
    });
  } catch (error) {
    next(error);
  }
};

//@desc   Get all flash cards for a docs
//@route  GET /api/flashcard/:documentId
//@access private
export const getFlashCardbyId = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const getFlashCard = await FlashCard.find({
      userId: req.user._id,
      documentId: req.params.id,
    })
      .populate('documentId', 'title fileName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: getFlashCard.length,
      data: getFlashCard,
    });
  } catch (error) {
    next(error);
  }
};

//@desc   Mark flashcard as reviewd
//@route  POST /api/flashcard/:cardId/review
//@access private
export const reviewFlashcard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const flashCardSet = await FlashCard.findOne({
      'cards._id': req.params.cardId,
      userId: req.user._id,
    });
    if (!flashCardSet) {
      res.status(404).json({
        success: false,
        error: 'Flash card set not found',
        statusCode: 404,
      });
    }

    const cardIndex: any = flashCardSet?.cards.findIndex(
      (card) => card._id?.toString() === req.params.cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Card not found in set',
        statuscode: 404,
      });
    }

    //update
    flashCardSet!.cards[cardIndex].lastReviewed = new Date();
    flashCardSet!.cards[cardIndex].reviewCount += 1;

    await flashCardSet!.save();

    res.status(200).json({
      success: true,
      data: flashCardSet,
      message: 'flashCard reviewed successfully',
    });
  } catch (error) {
    next(error);
  }
};

//@desc   Toggle star/favorite on flashcard
//@route  PUT /api/flashcard/:cardId/star
//@access private
export const toggleFlashCard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const flashCardSet = await FlashCard.findOne({
      'cards._id': req.params.cardId,
      userId: req.user._id,
    });

    if (!flashCardSet) {
      return res.status(404).json({
        success: false,
        error: 'FlashCard set or card not found',
        statusCode: 404,
      });
    }

    const cardIndex = flashCardSet.cards.findIndex(
      (card) => card._id?.toString() === req.params.cardId
    );
    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Card not found in set',
        statuscode: 404,
      });
    }

    //toggle star
    flashCardSet.cards[cardIndex].isStarred =
      !flashCardSet.cards[cardIndex].isStarred;

    await flashCardSet.save();

    res.status(200).json({
      success: true,
      data: flashCardSet,
      message: `FlashCard ${
        flashCardSet.cards[cardIndex].isStarred ? 'starred' : 'unstarred'
      }`,
    });
  } catch (error) {
    next(error);
  }
};

//@desc   delete flash card set
//@route  DELETE /api/flashcard/:Id
//@access private
export const deleteFlashCardSets = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const flashCardSet = await FlashCard.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!flashCardSet) {
      return res.status(404).json({
        success: false,
        error: 'Flasjcard set not found',
      });
    }

    await flashCardSet.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Flashcard set deleted sucessfully',
    });
  } catch (error) {
    next(error);
  }
};
