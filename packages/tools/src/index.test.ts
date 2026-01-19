import { getPopularity } from "./index";

describe("getPopularity", () => {
  it("should return popularity data for a valid name", async () => {
    const data = await getPopularity("John");
    expect(data.timeseries).toBeDefined();
    expect(data.timeseries?.length).toBeGreaterThan(0);
    expect(data.notes).toBe("Popularity data is based on the top 1000 names from 1880 to 2009.");
  });

  it("should return a note if the name is not found", async () => {
    const data = await getPopularity("NonExistentName");
    expect(data.timeseries).toBeUndefined();
    expect(data.notes).toBe("No popularity data found for this name.");
  });

  it("should return a note for non-US regions", async () => {
    const data = await getPopularity("John", "CA");
    expect(data.timeseries).toBeUndefined();
    expect(data.notes).toBe("Popularity data is only available for the US.");
  });
});
