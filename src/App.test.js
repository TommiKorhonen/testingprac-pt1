import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event"
import App from './App';

const typeIntoFrom = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i
  });
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i)
  if (email) {
    userEvent.type(emailInputElement, email)
  }
  if (password) {
    userEvent.type(passwordInputElement, password);
  }
  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword);
  }
  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement
  }
}

const formSubmit = () => {
  const submitBtnElement = screen.getByRole("button", {
    name: /submit/i
  });
  userEvent.click(submitBtnElement);
}

describe("App", () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(<App />)
  })

  test("inputs should be initially empty", () => {
    expect(
      screen.getByRole("textbox").value).toBe("");
    expect(
      screen.getByLabelText("Password").value).toBe("");
    expect(
      screen.getByLabelText(/confirm password/i).value).toBe("");
  });

  test("should be able to type an email", () => {
    const { emailInputElement } = typeIntoFrom({ email: "selena@gmail.com" });
    expect(emailInputElement.value).toBe("selena@gmail.com")
  });

  test("should be able to type a password", () => {
    const { passwordInputElement } = typeIntoFrom({ password: "test" });
    expect(passwordInputElement.value).toBe("test");
  });

  test("should be able to type password confirmation", () => {
    const { confirmPasswordInputElement } = typeIntoFrom({ confirmPassword: "test" });
    expect(confirmPasswordInputElement.value).toBe("test");
  });

  describe("Error Handling", () => {
    test("should show email error message on invalid email", () => {
      expect(
        screen.queryByText(/the email you input is invalid/i)
      ).not.toBeInTheDocument();

      typeIntoFrom({ email: "selenagmail.com" })

      formSubmit();

      expect(
        // eslint-disable-next-line testing-library/prefer-presence-queries
        screen.queryByText(/the email you input is invalid/i)
      ).toBeInTheDocument();

    });

    test("should show password error message if password length is under 5 characters", () => {
      typeIntoFrom({ email: "selena@gmail.com" })

      expect(
        screen.queryByText(/the password you entered should contain 5 or more characters/i)
      ).not.toBeInTheDocument();

      typeIntoFrom({ password: "pass" })

      formSubmit();

      expect(
        // eslint-disable-next-line testing-library/prefer-presence-queries
        screen.queryByText(/the password you entered should contain 5 or more characters/i)).toBeInTheDocument();
    });

    test("should show confirm password error if password confirmation doesn't match password field", () => {
      typeIntoFrom({
        email: "selena@gmail.com",
        password: "password"
      })

      expect(
        screen.queryByText(/the passwords don't match. try again/i
        )).not.toBeInTheDocument();
      typeIntoFrom({ confirmPassword: "wordpass" })

      formSubmit();

      // eslint-disable-next-line testing-library/prefer-presence-queries
      expect(screen.queryByText(
        /the passwords don't match. try again/i
      )).toBeInTheDocument();
    });

    test("should show no error if every input is valid", () => {
      typeIntoFrom({
        email: "selena@gmail.com",
        password: "password",
        confirmPassword: "password"
      })

      formSubmit();

      expect(screen.queryByText(
        /the email you input is invalid/i
      )).not.toBeInTheDocument();
      expect(screen.queryByText(
        /the password you entered should contain 5 or more characters/i
      )).not.toBeInTheDocument();
      expect(screen.queryByText(
        /the passwords don't match. try again/i
      )).not.toBeInTheDocument();
    });
  })
})

