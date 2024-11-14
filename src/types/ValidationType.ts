import * as v from "valibot";

export const CoachEditMemberSchema = v.object({
  name: v.optional(v.pipe(
    v.string('Your name must be in text.'),
    v.nonEmpty('Your name cannot be blank.'),
  )),
  phone: v.optional(v.pipe(
    v.string('You must include your phone number.'),
    v.maxLength(20, 'The phone number must not exceed 20 characters.'),
    v.nonEmpty('Your phone number cannot be blank.'),
  )),
  emergencyName: v.optional(v.pipe(
    v.string('The name must be in text.'),
    v.nonEmpty("The emergency contact's name cannot be blank"),
  )),
  emergencyPhone: v.optional(v.pipe(
    v.string("You must include your emergency contact's phone number."),
    v.maxLength(20, 'The phone number must not exceed 20 characters.'),
    v.nonEmpty("Your emergency contact's phone number cannot be blank."),
  )),
});
export type CoachEditMemberData = v.InferOutput<typeof CoachEditMemberSchema>;


export const SignUpSchema = v.pipe(
  v.object({
    name: v.pipe(
      v.string('Your name must be in text.'),
      v.nonEmpty('Please enter your name.'),
    ),
    email: v.pipe(
      v.string('Your email must be a string of characters.'),
      v.nonEmpty('Please enter your email.'),
      v.email('The email address is formatted incorrectly.')
    ),
    emailVisibility: v.literal(true),
    password: v.pipe(
      v.string('Your password must be a string of characters.'),
      v.nonEmpty('Please enter your password'),
      v.minLength(8, 'Your password must have 8 characters or more.')
    ),
    passwordConfirm: v.pipe(
      v.string('Your password must be a string of characters.'),
      v.nonEmpty('Please enter your password'),
      v.minLength(8, 'Your password must have 8 characters or more.')
    )
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['passwordConfirm']],
      (input) => input.password === input.passwordConfirm,
      'The passwords do not match.'
    ),
    ['password']
  ),
);
export type SignUpData = v.InferOutput<typeof SignUpSchema>;


export const LoginSchema = v.object({
  email: v.pipe(
    v.string('Your email must be a string.'),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is formatted incorrectly.')
  ),
  password: v.pipe(
    v.string('Your password must be a string.'),
    v.nonEmpty('Please enter your password'),
    v.minLength(8, 'Your password must have 8 characters or more.')
  ),
});
export type LoginData = v.InferOutput<typeof LoginSchema>;

