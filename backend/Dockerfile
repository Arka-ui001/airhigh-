# ---------- Build stage ----------
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /workspace/app
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /workspace/app/target/*.jar app.jar

# Optional JVM tuning
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"

# Render provides $PORT. Fall back to 8080 locally.
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]