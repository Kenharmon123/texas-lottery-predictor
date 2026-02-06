import * as tf from '@tensorflow/tfjs';

export interface LotteryPrediction {
  numbers: number[];
  confidence: number;
  hotNumbers: number[];
  coldNumbers: number[];
  frequency: Record<number, number>;
  patterns: string[];
  recommendations: string[];
}

export class TexasLotteryEngine {
  private model: tf.LayersModel | null = null;
  private historicalData: number[][] = [];
  
  constructor() {
    this.initializeModel();
  }

  private async initializeModel(): Promise<void> {
    // Create a neural network for pattern recognition
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [6], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 6, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
  }

  public async train(historicalDraws: number[][]): Promise<void> {
    this.historicalData = historicalDraws;
    
    if (historicalDraws.length < 10) {
      console.warn('Insufficient data for training');
      return;
    }

    const normalized = historicalDraws.map(draw => 
      draw.map(num => num / 54) // Normalize to 0-1 range
    );

    const xs = tf.tensor2d(normalized.slice(0, -1));
    const ys = tf.tensor2d(normalized.slice(1));

    await this.model?.fit(xs, ys, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}`);
          }
        }
      }
    });

    xs.dispose();
    ys.dispose();
  }

  public async predict(): Promise<LotteryPrediction> {
    const frequency = this.calculateFrequency();
    const hotNumbers = this.getHotNumbers(frequency, 10);
    const coldNumbers = this.getColdNumbers(frequency, 10);
    
    let predictedNumbers: number[];
    let confidence = 0.65;

    if (this.model && this.historicalData.length > 0) {
      const lastDraw = this.historicalData[this.historicalData.length - 1];
      const normalized = lastDraw.map(num => num / 54);
      const input = tf.tensor2d([normalized]);
      const prediction = this.model.predict(input) as tf.Tensor;
      const predArray = await prediction.data();
      
      predictedNumbers = Array.from(predArray)
        .map(val => Math.round(val * 54))
        .filter(num => num >= 1 && num <= 54);
      
      input.dispose();
      prediction.dispose();
      
      confidence = 0.75;
    } else {
      // Fallback: weighted random selection
      predictedNumbers = this.generateWeightedPrediction(hotNumbers, coldNumbers);
    }

    // Ensure 6 unique numbers
    predictedNumbers = this.ensureUniqueNumbers(predictedNumbers, 6, 54);

    const patterns = this.detectPatterns(predictedNumbers);
    const recommendations = this.generateRecommendations(predictedNumbers, hotNumbers, coldNumbers);

    return {
      numbers: predictedNumbers.sort((a, b) => a - b),
      confidence,
      hotNumbers,
      coldNumbers,
      frequency,
      patterns,
      recommendations
    };
  }

  private calculateFrequency(): Record<number, number> {
    const freq: Record<number, number> = {};
    for (let i = 1; i <= 54; i++) {
      freq[i] = 0;
    }

    this.historicalData.forEach(draw => {
      draw.forEach(num => {
        if (freq[num] !== undefined) {
          freq[num]++;
        }
      });
    });

    return freq;
  }

  private getHotNumbers(frequency: Record<number, number>, count: number): number[] {
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([num]) => parseInt(num));
  }

  private getColdNumbers(frequency: Record<number, number>, count: number): number[] {
    return Object.entries(frequency)
      .sort(([, a], [, b]) => a - b)
      .slice(0, count)
      .map(([num]) => parseInt(num));
  }

  private generateWeightedPrediction(hotNumbers: number[], coldNumbers: number[]): number[] {
    const numbers: number[] = [];
    
    // 60% from hot numbers, 30% random, 10% from cold numbers
    while (numbers.length < 4) {
      const hot = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
      if (!numbers.includes(hot)) numbers.push(hot);
    }
    
    while (numbers.length < 6) {
      const random = Math.floor(Math.random() * 54) + 1;
      if (!numbers.includes(random)) numbers.push(random);
    }

    return numbers;
  }

  private ensureUniqueNumbers(numbers: number[], count: number, max: number): number[] {
    const unique = [...new Set(numbers)].filter(n => n >= 1 && n <= max);
    
    while (unique.length < count) {
      const newNum = Math.floor(Math.random() * max) + 1;
      if (!unique.includes(newNum)) {
        unique.push(newNum);
      }
    }

    return unique.slice(0, count);
  }

  private detectPatterns(numbers: number[]): string[] {
    const patterns: string[] = [];
    const sorted = [...numbers].sort((a, b) => a - b);
    
    // Check for consecutive numbers
    let consecutive = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i + 1] - sorted[i] === 1) consecutive++;
    }
    if (consecutive >= 2) patterns.push(`${consecutive + 1} consecutive numbers detected`);

    // Check for even/odd distribution
    const even = numbers.filter(n => n % 2 === 0).length;
    const odd = numbers.length - even;
    patterns.push(`Even/Odd ratio: ${even}/${odd}`);

    // Check for number range distribution
    const low = numbers.filter(n => n <= 18).length;
    const mid = numbers.filter(n => n > 18 && n <= 36).length;
    const high = numbers.filter(n => n > 36).length;
    patterns.push(`Range distribution: Low(${low}) Mid(${mid}) High(${high})`);

    return patterns;
  }

  private generateRecommendations(numbers: number[], hotNumbers: number[], coldNumbers: number[]): string[] {
    const recommendations: string[] = [];
    
    const hotCount = numbers.filter(n => hotNumbers.includes(n)).length;
    if (hotCount > 4) {
      recommendations.push('Consider balancing hot numbers with some cold numbers');
    } else if (hotCount < 2) {
      recommendations.push('Consider adding more hot numbers to your selection');
    }

    const coldCount = numbers.filter(n => coldNumbers.includes(n)).length;
    if (coldCount > 2) {
      recommendations.push('High-risk strategy detected with cold numbers');
    }

    recommendations.push('Always play responsibly and within your budget');
    recommendations.push('Remember: lottery outcomes are random - predictions are for entertainment');

    return recommendations;
  }

  public dispose(): void {
    this.model?.dispose();
  }
}
