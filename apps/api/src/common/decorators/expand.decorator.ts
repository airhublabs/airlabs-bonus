import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty, IsOptional
} from 'class-validator';
import { expandTransform } from '../helpers/expand.helper';

export const ExpandTransform = () => {
	return applyDecorators(
		IsOptional(),
		IsNotEmpty(),
		ApiPropertyOptional({ type: String, isArray: true }),
		Transform(
			({ value }: { value: string | string[] }) => {
				if (!value) return;

				if (Array.isArray(value)) return expandTransform(value);

				const parts = value
					.replace(' ', '')
					.split(',')
					.map((part) => `"${part}"`);

				const parsed = JSON.parse(`[${parts.join(',')}]`);

				return expandTransform(parsed);
			},
			{ toClassOnly: true }
		)
	);
};
