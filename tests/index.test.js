import { describe, expect, it } from "vitest";
import { askReduction } from "../src/index";

describe("promocode validation application", () => {
  describe("A promocode is valid when all the restrictions are valid. Then return the advantage", () => {
    it("The promocode is valid as age is between gt and lt", async () => {
      const promocode = {
        name: "AgeCode",
        advantage: { percent: 25 },
        restrictions: {
          age: {
            gt: 10,
            lt: 20,
          },
        },
      };
  
      const information = {
        age: 15,
      };
  
      const result = await askReduction(information, promocode);
  
      expect(result).toEqual({
        advantage: { percent: 25 },
        promocode_name: "AgeCode",
        status: "accepted",
      });
    });
  
    it("The promocode is valid as date is between after and before, and weather is like is with a temperature less than lt, and age is not equal to eq but between lt and gt", async () => {
      const promocode = {
        name: "ComplexCode",
        advantage: { percent: 20 },
        restrictions: {
          or: [
            {
              age: {
                eq: 40,
              },
            },
            {
              age: {
                lt: 30,
                gt: 15,
              },
            },
          ],
          date: {
            after: "2021-01-01",
            before: "2022-01-01",
          },
          weather: {
            is: "clear",
            temp: {
              lt: 15, // Celsius here.
            },
          },
        },
      };

      const information = {
        age: 16,
        town: "Lyon",
      };

      const result = await askReduction(information, promocode);

      expect(result).toEqual({
        advantage: { percent: 20 },
        promocode_name: "ComplexCode",
        status: "accepted",
      });
    });
  });

  describe("A promocode is invalid when at least one restriction is not valid. Then return the reasons for the invalidity", () => {
    it("The promocode is invalid as age is not between gt and lt", async () => {
      const promocode = {
        name: "AgeCode",
        advantage: { percent: 20 },
        restrictions: {
          age: {
            gt: 10,
            lt: 20,
          },
        },
      };

      const information = {
        age: 55,
      };

      const result = await askReduction(information, promocode);

      expect(result).toEqual({
        promocode_name: "AgeCode",
        reasons: [
          // TODO à compléter
        ],
        status: "denied",
      });
    });
  });
});
