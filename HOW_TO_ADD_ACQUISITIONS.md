# How to Add New Acquisitions

Adding new acquisitions is super easy! Just follow these steps:

## Method 1: Edit the JSON file directly (Easiest)

1. Open `data/acquisitions.json`
2. Add a new entry to the array with this format:

```json
{
  "date": "2025-02-15",
  "amount": 500000,
  "price": 0.0035,
  "note": "Your note here"
}
```

3. Save the file
4. The chart will automatically update!

## Method 2: Tell me and I'll add it

Just tell me:
- **Date**: When did you acquire? (e.g., "2025-02-15")
- **Amount**: How many URANUS tokens? (e.g., 500000)
- **Price**: Price per token in USD (e.g., 0.0035)
- **Note** (optional): Any note you want (e.g., "Big buy")

And I'll add it to the file for you!

## Example

To add an acquisition from February 15, 2025:
- Amount: 750,000 tokens
- Price: $0.0035 per token
- Note: "Strategic accumulation"

Just say: "Add acquisition: date 2025-02-15, amount 750000, price 0.0035, note Strategic accumulation"

## Date Format

Always use: `YYYY-MM-DD` format (e.g., `2025-02-15`)

## Notes

- The chart will show the URANUS price line and acquisition bars
- Acquisitions appear as blue vertical bars on the chart
- The price line shows the historical URANUS price
- Both are displayed on the same timeline for easy comparison
