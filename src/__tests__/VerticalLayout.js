/**
 * @jest-environment jsdom
 */

import VerticalLayout from "../views/VerticalLayout"
import { screen } from "@testing-library/dom"
import { localStorageMock } from "../__mocks__/localStorage.js"

describe('Given I am connected as Employee', () => {
  describe('When the VerticalLayout is displayed on page load', () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    const user = JSON.stringify({
      type: 'Employee'
    })
    window.localStorage.setItem('user', user)

    const html = VerticalLayout(120)
    document.body.innerHTML = html
   
    test("Then window icon should be rendered", () => {
      // expected values
      expect(screen.getByTestId('icon-window')).toBeTruthy()
    })

    test("Then email icon should be rendered", () => {
      // expected values
      expect(screen.getByTestId('icon-mail')).toBeTruthy()
    })
  })

})
