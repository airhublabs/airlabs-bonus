import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, ValidationOptions } from 'class-validator';

/**
 *  Checks if a query paramter value is a boolean from a string version of "true" or "false"
 * @param booleanOptions - options for boolean validator
 * @param apiProperty - include in swagger api. DEFAULT: TRUE
 * @returns
 */
export const IsQueryBoolean = (booleanOptions?: ValidationOptions, apiProperty = true) => {
  const decorators: PropertyDecorator[] = [];
  if (apiProperty) decorators.push(ApiPropertyOptional());

  const BooleanStringTransform = () => {
    return Transform((param) => {
      if (param.value === 'true' || param.value === true) return true;
      if (param.value === 'false' || param.value === false) return false;

      return false;
    });
  };

  return applyDecorators(
    BooleanStringTransform(),
    IsBoolean(booleanOptions),
    IsOptional(),
    ...decorators
  );
};
