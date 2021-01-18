import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('The outcome value is greater than the total');
    }

    let categoryValue: Category;

    const checkCategoryTitleExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (checkCategoryTitleExists) {
      categoryValue = checkCategoryTitleExists;
    } else {
      categoryValue = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryValue);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryValue.id,
    });

    await transactionRepository.save(transaction);

    const createdTransaction = {
      ...transaction,
      category: categoryValue,
    };

    return createdTransaction;
  }
}

export default CreateTransactionService;
