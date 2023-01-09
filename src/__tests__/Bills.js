/**
 * @jest-environment jsdom
 */
 import userEvent from '@testing-library/user-event'
 import { localStorageMock } from "../__mocks__/localStorage.js"
 import { screen } from "@testing-library/dom"
 import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
 
 // Store
 import mockStore from "../__mocks__/store"
 
 // Bills
 import BillsUI from "../views/BillsUI.js"
 import BillsContainer from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"

// Router
import router from "../app/Router.js"

jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    beforeEach(() => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      Object.defineProperty(window, "location", { value: { hash: ROUTES_PATH['Bills'] } })

      localStorage.setItem('user', JSON.stringify({ type: "Employee" }))
      document.body.innerHTML = `<div id="root"></div>`

      router() 
    })

    test("Then bill icon in vertical layout should be highlighted", () => {
      const icon = screen.getByTestId('icon-window')

      // expected values
      expect(icon.classList.contains("active-icon")).toBe(true)
    })

    test("Then bills should be ordered from earliest to latest", () => {
           // Array Sort Bills By Date DESC
           const html = BillsUI({ data: bills.sort((a, b) => new Date(b.date) - new Date(a.date)) })
           document.body.innerHTML = html
           const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
           const antiChrono = (a, b) => ((a < b) ? 1 : -1)
           const datesSorted = [...dates].sort(antiChrono)
     
           // expected values
           expect(dates).toEqual(datesSorted)
         })  
       })
     
       describe("When I am on Bills Page and I click on new Bills", () => {
         test("Then new bill form appears", () => {
           const onNavigate = (pathname) => {
             document.body.innerHTML = ROUTES({ pathname })
           }
     
           Object.defineProperty(window, 'localStorage', { value: localStorageMock })
           window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
     
           const billsContainer = new BillsContainer({
             document, onNavigate, store: null, localStorage: window.localStorage
           })
     
           const html = BillsUI({ data: bills.sort((a, b) => new Date(b.date) - new Date(a.date)) })
           document.body.innerHTML = html
     
           const handleShowModalNewBill = jest.fn((e) => billsContainer.handleClickNewBill(e))
           const btnNewBill = screen.getByTestId('btn-new-bill')
     
           btnNewBill.addEventListener('click', handleShowModalNewBill)
           userEvent.click(btnNewBill)
     
           // expected values
           expect(handleShowModalNewBill).toHaveBeenCalled()
           expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
         })
       })
     
       describe("When I am on Bills Page and I click on icon Eye og bill", () => {
         test("Then modal with supporting documents appears", () => {
           $.fn.modal = jest.fn()
           const onNavigate = (pathname) => {
             document.body.innerHTML = ROUTES({ pathname })
           }
     
           Object.defineProperty(window, 'localStorage', { value: localStorageMock })
           window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
     
           const billsContainer = new BillsContainer({
             document, onNavigate, store: null, localStorage: window.localStorage
           })
     
           const html = BillsUI({ data: bills.sort((a, b) => new Date(b.date) - new Date(a.date)) })
           document.body.innerHTML = html
     
           const iconEye = screen.getAllByTestId('icon-eye')[0]
           const handleShowModalFile = jest.fn((e) => { billsContainer.handleClickIconEye(e.target) })
     
           iconEye.addEventListener('click', handleShowModalFile)
           userEvent.click(iconEye)
     
           // expected values
           expect(handleShowModalFile).toHaveBeenCalled()
           expect(screen.getAllByText('Justificatif')).toBeTruthy()
         })  
       })
     
     })