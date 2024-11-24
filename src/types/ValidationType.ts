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

export const ClassSchema = v.pipe(
  v.object({
    martial_art: v.pipe(
      v.string(),
      v.nonEmpty('You must choose a program.'),
    ),
    date: v.date('You must select a class date'),
    week_day: v.pipe(
      v.number(),
      v.integer(),
      v.toMinValue(0),
      v.toMaxValue(6),
    ),
    start_hour: v.pipe(
      v.number(),
      v.integer(),
      v.toMinValue(0),
      v.toMaxValue(24),
    ),
    start_minute: v.pipe(
      v.number(),
      v.integer(),
      v.toMinValue(0),
      v.toMaxValue(59),
    ),
    end_hour: v.pipe(
      v.number(),
      v.integer(),
      v.minValue(0),
      v.maxValue(24),
    ),
    end_minute: v.pipe(
      v.number(),
      v.integer(),
      v.toMinValue(0),
      v.toMaxValue(59),
    ),
    is_recurring: v.boolean(),
    active: v.boolean(),
  }),
  v.forward(
    v.partialCheck(
      [['start_hour'], ['end_hour'], ['start_minute'], ['end_minute']],
      (input) => {
        if (input.start_hour < input.end_hour) {
          return true
        } else if (input.start_hour === input.end_hour && input.start_minute <= input.end_minute) {
          return true
        } else { // input.start_hour > input.end_hour
          return false
        }
      },
      'The class start time must occur before the end time.'
    ),
    ['start_hour']
  ),
);
export type ClassData = v.InferOutput<typeof ClassSchema>;